require("dotenv").config();

export const DB_PASSWORD = String(process.env.DB_PASSWORD);
export const AWS_ACCESS_KEY = String(process.env.AWS_ACCESS_KEY);
export const AWS_SECRET_ACCESS_KEY = String(process.env.AWS_SECRET_ACCESS_KEY);
export const HOSTED_ZONE_ID = String(process.env.HOSTED_ZONE_ID);
export const HOSTED_ZONE = String(process.env.HOSTED_ZONE);


export const dbConfig: DatabaseConfig = {
  username: "DATABASE_USER",
  password: DB_PASSWORD,
  database: "DATABASE_NAME",
  hostname: "",
  port: 0,
  socketAddress: "",
};

export interface DatabaseConfig {
  username: string;
  password: string;
  database: string;
  hostname: string;
  port: number;
  socketAddress: string;
}

export const secretConfig = {
  arn: "arn:aws:secretsmanager:<REGION>:<ACCOUNT_ID>:secret:<SECRET_ID>",
  id: "SECRET_ID",
};

export const githubConfig = {
  owner: "GITHUB_ACCOUNT_NAME",
  repo: "GITHUB_REPO_NAME",
  branch: "GITHUB_BRANCH",
};
export const CERTIFICATE_ARN = "arn:aws:acm:<REGION>:<ACCOUNT_ID>:certificate/<CERTIFICATE_ID>"
