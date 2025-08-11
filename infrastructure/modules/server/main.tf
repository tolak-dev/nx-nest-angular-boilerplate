terraform {
  required_providers {
    hcloud = {
      source = "hetznercloud/hcloud"
    }
  }
}

resource "hcloud_server" "vm" {
  name        = var.name
  server_type = var.server_type
  image       = var.image
  location    = var.location
  ssh_keys    = var.ssh_keys
}
