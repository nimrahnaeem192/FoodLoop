terraform {
  required_version = ">= 1.5.0"

  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.33"
    }
  }
}

# Provider configuration and remote state will be added during infrastructure implementation.
# Do not hardcode credentials.
