variable "name" {}
variable "server_type" {}
variable "image" {}
variable "location" {}
variable "ssh_keys" { type = list(string) }
variable "public_key_path" {}
