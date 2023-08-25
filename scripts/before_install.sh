#!/bin/bash

# navigate to app folder
cd /home/ec2-user/partner-portal

# install node and npm
curl -sL https://rpm.nodesource.com/setup_12.x | sudo -E bash -
yum -y install nodejs npm