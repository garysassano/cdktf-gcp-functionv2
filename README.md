# cdktf-gcp-functionv2

CDKTF app that deploys a [Cloud Function (2nd Gen)](https://cloud.google.com/blog/products/serverless/cloud-functions-2nd-generation-now-generally-available) to GCP.

## Prerequisites

- **_GCP:_**
  - Must have authenticated with [Application Default Credentials](https://registry.terraform.io/providers/hashicorp/google/latest/docs/guides/provider_reference#running-terraform-on-your-workstation) in your local environment.
  - Must have set the `GCP_PROJECT_ID` and `GCP_REGION` variables in your local environment.
- **_Node.js + npm:_**
  - Must be [installed](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) in your system.

## Installation

```sh
npx projen install
```

## Deployment

```sh
npx projen deploy
```

## Cleanup

```sh
npx projen destroy
```
