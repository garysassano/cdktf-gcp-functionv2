import os
from cdktf import TerraformStack
from cdktf_cdktf_provider_google.cloudfunctions2_function import Cloudfunctions2Function
from cdktf_cdktf_provider_google.provider import GoogleProvider
from cdktf_cdktf_provider_google.storage_bucket import StorageBucket
from cdktf_cdktf_provider_google.storage_bucket_object import StorageBucketObject
from constructs import Construct


class FunctionV2Stack(TerraformStack):
    def __init__(self, scope: Construct, ns: str):
        super().__init__(scope, ns)

        GCP_PROJECT_ID = os.environ.get("GCP_PROJECT_ID")
        GCP_REGION = os.environ.get("GCP_REGION")

        GoogleProvider(
            self,
            "GoogleProvider",
            project=GCP_PROJECT_ID,
            region=GCP_REGION,
            credentials=os.path.abspath("credentials.json"),
        )

        functionv2_source_bucket = StorageBucket(
            self,
            "StorageBucket_functionv2-source-bucket",
            name=f"{GCP_PROJECT_ID}-functionv2-source-bucket",
            location=GCP_REGION,
        )

        functionv2_source_archive = StorageBucketObject(
            self,
            "StorageBucketObject_functionv2-source-archive",
            name="function-source.zip",
            bucket=functionv2_source_bucket.name,
            source=os.path.abspath("assets/function-source.zip"),
        )

        functionv2 = Cloudfunctions2Function(
            self,
            "CloudFunction2_functionv2",
            name="functionv2",
            location=GCP_REGION,
            build_config={
                "runtime": "python310",
                "entry_point": "hello_http",
                "source": {
                    "storage_source": {
                        "bucket": functionv2_source_bucket.name,
                        "object": functionv2_source_archive.name,
                    },
                },
            },
            service_config={
                "max_instance_count": 1,
                "available_memory": "256M",
                "timeout_seconds": 60,
            },
        )
