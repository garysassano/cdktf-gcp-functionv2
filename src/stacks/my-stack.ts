import path from "path";
import { AssetType, TerraformAsset, TerraformStack } from "cdktf";
import { Construct } from "constructs";
import { GoogleProvider } from "../../.gen/providers/google/provider";
import { StorageBucket } from "../../.gen/providers/google/storage-bucket";
import { StorageBucketObject } from "../../.gen/providers/google/storage-bucket-object";
import { Cloudfunctions2Function } from "../../.gen/providers/google/cloudfunctions2-function";
import { ServiceAccount } from "../../.gen/providers/google/service-account";

export class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const uniqueId = this.node.addr.substring(0, 8);

    // Read GCP_PROJECT_ID and GCP_REGION from environment variables
    const gcpProjectId = process.env.GCP_PROJECT_ID;
    const gcpRegion = process.env.GCP_REGION;
    if (!gcpProjectId || !gcpRegion) {
      throw new Error(
        "Required environment variables 'GCP_PROJECT_ID' or 'GCP_REGION' are missing or undefined"
      );
    }

    const gcpProvider = new GoogleProvider(this, "GcpProvider", {
      project: gcpProjectId,
      region: gcpRegion,
    });

    // Convert path's AssetType from DIRECTORY to ARCHIVE
    const functionv2Asset = new TerraformAsset(this, "Functionv2Asset", {
      path: path.join(__dirname, "..", "functions", "sample"),
      type: AssetType.ARCHIVE,
    });

    const functionv2SourceBucket = new StorageBucket(
      this,
      "Functionv2SourceBucket",
      {
        name: `functionv2-source-bucket-${uniqueId}`,
        location: gcpProvider.region!,
      }
    );

    const functionv2SourceObject = new StorageBucketObject(
      this,
      "Functionv2SourceObject",
      {
        name: "functionv2-source.zip",
        bucket: functionv2SourceBucket.name,
        source: functionv2Asset.path,
      }
    );

    const functionv2ServiceAccount = new ServiceAccount(
      this,
      "Functionv2ServiceAccount",
      {
        accountId: `functionv2-${uniqueId}-sa`,
        displayName: `Service Account for functionv2-${uniqueId}`,
      }
    );

    new Cloudfunctions2Function(this, "Functionv2", {
      name: `functionv2-${uniqueId}`,
      location: gcpProvider.region!,
      buildConfig: {
        runtime: "nodejs20",
        entryPoint: "handler",
        source: {
          storageSource: {
            bucket: functionv2SourceBucket.name,
            object: functionv2SourceObject.name,
          },
        },
      },
      serviceConfig: {
        maxInstanceCount: 1,
        availableMemory: "256M",
        timeoutSeconds: 60,
        serviceAccountEmail: functionv2ServiceAccount.email,
      },
    });
  }
}
