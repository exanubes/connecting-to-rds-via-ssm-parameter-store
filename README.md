# CI/CD Pipeline for ECS Application 


Repository from [exanubes.com](https://exanubes.com) for [Connecting to RDS via Parameter Store config](https://exanubes.com/blog/connecting-to-rds-via-parameter-store-config).


This repository is using AWS CDK v2 and is not compatible with AWS CDK v1 bootstrap stack.

## Commands:

- Run `npm run setup` in the root of the project to install node_modules in root and subdirectories
- Run `npm run start` in the root of the project to run backend application
- You can remove modules from all subdirectories with `npm run cleanup`

Run the following commands inside `infrastructure` directory for building, deploying and destroying the stacks

```
npm run build
npm run cdk:deploy -- --all
npm run cdk:destroy -- --all
```


Deploy & destroy commands use the `aws-cli sts` service to get the account id and aws IAM role `exanubes-cloudformation-access` in order to dynamically provide role arn. Make sure you're using the account you want to deploy the stacks to and that you have the role created either with the same name or different name and change the scripts in `infrastructure/package.json`.
