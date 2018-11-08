#!/bin/bash
#microservices..
  #apis4atp..
  #git clone --quiet https://github.com/solutionsanz/apis4atp >>/tmp/noise.out && cd apis4atp
  kubectl create namespace apis4harness >>/tmp/noise.out
  kubectl create -f kubernetes/apis4harness-dpl.yaml >>/tmp/noise.out
  kubectl create -f kubernetes/apis4harness-svc.yaml >>/tmp/noise.out
  kubectl create -f kubernetes/apis4harness-ing.yaml >>/tmp/noise.out
