output "fqdn" {
  value = "${var.subdomain}.${hetznerdns_zone.featstack.name}"
}
