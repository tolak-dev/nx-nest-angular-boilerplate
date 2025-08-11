provider "hcloud" {
  token = var.hcloud_token
}

provider "hetznerdns" {
  apitoken = var.hetzner_dns_token
}

module "server" {
  source       = "../../modules/server"
  name         = "featstack-dev"
  server_type  = "cx21"
  image        = "ubuntu-22.04"
  location     = "fsn1"
  ssh_keys     = [var.ssh_key_name]
}

module "dns" {
  source     = "../../modules/dns"
  zone_id    = var.zone_id
  subdomain  = "dev"
  ip_address = module.server.ipv4_address
}

output "dev_ip" {
  value = module.server.ipv4_address
}

output "dev_domain" {
  value = module.dns.fqdn
}
