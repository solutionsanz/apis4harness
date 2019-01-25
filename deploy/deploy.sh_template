#!/bin/bash
#microservices..
  #apis4atp..
  #git clone --quiet https://github.com/solutionsanz/apis4atp >>/tmp/noise.out && cd apis4atp
  kubectl create namespace apis4harness
  kubectl create -f kubernetes/apis4harness-dpl.yaml
  kubectl create -f kubernetes/apis4harness-svc.yaml
  kubectl create -f kubernetes/apis4harness-ing.yaml
