#!/bin/bash
#microservices..
  #apis4atp..
  kubectl delete -f deploy/kubernetes/apis4harness-ing.yaml >>/tmp/noise.out
  kubectl delete -f deploy/kubernetes/apis4harness-svc.yaml >>/tmp/noise.out
  kubectl delete -f deploy/kubernetes/apis4harness-dpl.yaml >>/tmp/noise.out
  kubectl delete namespace apis4harness >>/tmp/noise.out