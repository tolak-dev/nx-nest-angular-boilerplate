resource "hetznerdns_record" "a_record" {
  zone_id = var.zone_id
  name    = var.subdomain
  type    = "A"
  value   = var.ip_address
  ttl     = 60
}
