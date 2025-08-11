terraform {
  required_version = ">= 1.5.0"

  required_providers {
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = "~> 1.51.0"
    }
    hetznerdns = {
      source  = "timohirt/hetznerdns"
      version = "~> 2.2.0"
    }
  }
}
