variable "aws_region" {
  type        = string
  description = "Configured AWS Region"
  default     = "us-east-1"
}

variable "source_ami" {
  type        = string
  description = "Default Ubuntu AMI to build our custom AMI"
  default     = "ami-08c40ec9ead489470" # Ubuntu 22.04 LTS
}

variable "ssh_username" {
  type        = string
  description = "username to ssh into the AMI Instance"
  default     = "ubuntu"
}

variable "subnet_id" {
  type        = string
  description = "Subnet of the custom VPC created usinfga custom CloudFormation stack"
  default     = "subnet-01e4cf39ebbe4747f"
}


# https://www.packer.io/plugins/builders/amazon/ebs
source "amazon-ebs" "ec2" {
  region          = "${var.aws_region}"
  ami_name        = "csye6225_commit_SHA"
  ami_description = "EC2 AMI for CSYE 6225 built by jeelpatel"
  ami_regions = [
    "us-east-1",
  ]
  ami_users = [603832434033]

  aws_polling {
    delay_seconds = 120
    max_attempts  = 50
  }

  instance_type = "t2.micro"
  source_ami    = "${var.source_ami}"
  ssh_username  = "${var.ssh_username}"
  subnet_id     = "${var.subnet_id}"

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/sda1"
    volume_size           = 50
    volume_type           = "gp2"
  }
}

build {
  sources = ["source.amazon-ebs.ec2"]

  # https://www.packer.io/docs/provisioners/file#uploading-files-that-don-t-exist-before-packer-starts
  provisioner "file" {
    source      = "webapp.zip"   # path in local system to a .tar file
    destination = "~/webapp.zip" # path in the AMI to store the webapp

  }
  provisioner "file" {
    source      = "webservice.service"   # path in local system to a .tar file
    destination = "~/webservice.service" # path in the AMI to store the webapp
}


  provisioner "shell" {
    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
      "CHECKPOINT_DISABLE=1"
    ]
    scripts = [
      "setup.sh",
      "after.sh"
    ]
  }
}