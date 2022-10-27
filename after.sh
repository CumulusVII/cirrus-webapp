#!/bin/bash
sudo cp /home/ubuntu/webservice.service /lib/systemd/system/webservice.service
sudo systemctl daemon-reload
sudo systemctl enable webservice
sudo systemctl start webservice
sudo systemctl status webservice