import os
from datetime import datetime
from kubernetes import client, config
from kubernetes.client.rest import ApiException


def init_kubernetes_client():
    try:
        config.load_kube_config()
    except Exception:
        config.load_incluster_config()
    return client.CoreV1Api()


def get_app_name():
    return os.getenv('APP_NAME')


def create_configmap_prompt(prompt_text, cost_info, namespace="claude-test"):

    app_name = get_app_name()
    
    if not app_name:
        app_name = "default-app"

    cost_summary = f"""Input Tokens: {cost_info.get('estimated_input_tokens', 0)}
Output Tokens: {cost_info.get('estimated_output_tokens', 0)}
Total Cost: ${cost_info.get('total_estimated_cost', 0.0):.6f}
Duration: {cost_info.get('duration', 0):.2f} seconds"""

    metadata = client.V1ObjectMeta(
        name=app_name,
        namespace=namespace,
        labels={
            "app": app_name,
            "created-by": "claude-coding-agent",
        }
    )

    data = {
        "prompt": prompt_text,
        "cost_info": cost_summary,
        "app_name": app_name,
    }

    configmap = client.V1ConfigMap(
        api_version="v1",
        kind="ConfigMap",
        metadata=metadata,
        data=data
    )

    try:
        v1 = init_kubernetes_client()
        namespace = namespace

        try:
            created_configmap = v1.create_namespaced_config_map(
                namespace=namespace,
                body=configmap
            )
            print(f"✓ ConfigMap '{app_name}' created successfully in namespace '{namespace}'")
            return created_configmap
        except ApiException as e:
            if e.status == 409:
                print(f"⚠ ConfigMap '{app_name}' already exists in namespace '{namespace}', updating it...")
                updated_configmap = v1.replace_namespaced_config_map(
                    name=app_name,
                    namespace=namespace,
                    body=configmap
                )
                print(f"✓ ConfigMap '{app_name}' updated successfully in namespace '{namespace}'")
                return updated_configmap
            else:
                print(f"❌ Failed to create ConfigMap '{app_name}': {e}")
                raise
    except Exception as e:
        print(f"❌ Error creating ConfigMap: {e}")
        print("⚠ Returning ConfigMap object without creating it in cluster")
        return configmap