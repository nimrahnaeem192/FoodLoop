variable "environment" {
  description = "Deployment environment name"
  type        = string
  default     = "dev"
}

variable "namespace" {
  description = "Kubernetes namespace for FoodLoop"
  type        = string
  default     = "foodloop"
}
