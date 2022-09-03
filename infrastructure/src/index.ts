#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {EcrStack} from "./stacks/ecr.stack";
import {VpcStack} from "./stacks/vpc.stack";
import {ElasticContainerStack} from "./stacks/elastic-container.stack";
import {Route53Stack} from "./stacks/route53.stack";
import {Environment, Tags} from "aws-cdk-lib";
import {PipelineStack} from "./stacks/pipeline.stack";
import {getAccountId, getRegion, resolveCurrentUserOwnerName} from "@exanubes/cdk-utils";
import {SecurityGroupStack} from './stacks/security-group.stack'
import {RdsStack} from './stacks/rds.stack'
import {ParameterStoreStack} from './stacks/parameter-store.stack'
import {dbConfig} from "./config";


async function start() {
    const owner = await resolveCurrentUserOwnerName();
    const account = await getAccountId();
    const region = await getRegion();
    const env: Environment = { account, region };
    const app = new cdk.App();
    const ecr = new EcrStack(app, EcrStack.name, { env });
    const vpc = new VpcStack(app, VpcStack.name, { env });
    const sg = new SecurityGroupStack(app, SecurityGroupStack.name, {
        env,
        vpc: vpc.vpc,
    });
    const rds = new RdsStack(app, RdsStack.name, {
        vpc: vpc.vpc,
        dbConfig,
        env,
        securityGroup: sg.databaseSg,
    });
    dbConfig.hostname = rds.db.instanceEndpoint.hostname;
    dbConfig.port = 5432; // note port taken from rds instance is a negative integer; by default postgress db is ran on 5432
    dbConfig.socketAddress = rds.db.instanceEndpoint.socketAddress;

    const ecs = new ElasticContainerStack(app, ElasticContainerStack.name, {
        vpc: vpc.vpc,
        repository: ecr.repository,
        rds: rds.db,
        env,
    });
    new Route53Stack(app, Route53Stack.name, {
        loadBalancer: ecs.loadBalancer,
        env,
    });

    new ParameterStoreStack(app, ParameterStoreStack.name, { dbConfig, env });

    new PipelineStack(app, PipelineStack.name, {
        repository: ecr.repository,
        service: ecs.service,
        cluster: ecs.cluster,
        container: ecs.container,
        env,
        dbConfig,
        vpc: vpc.vpc,
        rds: rds.db,
        securityGroup: sg.databaseAccessSg,
    });
    Tags.of(app).add("owner", owner);
}

start().catch(error => {
    console.log(error)
    process.exit(1)
})
