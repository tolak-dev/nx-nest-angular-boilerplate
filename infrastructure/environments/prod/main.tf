terraform {
  required_providers {
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = "~> 1.51.0"
    }
  }
}

provider "hcloud" {
  token = var.hcloud_token
}

module "server" {
  source           = "../../modules/server"
  name             = "nx-monorepo-prod"
  image            = "ubuntu-24.04"
  server_type      = "cx22"
  location         = "nbg1"
  ssh_keys         = ["github-ci-featstack"]
  public_key_path = "~/.ssh/hetzner_featstack_ci.pub"
  providers = {
    hcloud = hcloud
  }
}
