#!/usr/bin/env bash
set -euo pipefail

echo "=== Step 1: Stop Docker cleanly ==="
sudo systemctl stop docker docker.socket containerd

echo "=== Step 2: Switch to nft backend ==="
sudo update-alternatives --set iptables /usr/sbin/iptables-nft
sudo update-alternatives --set ip6tables /usr/sbin/ip6tables-nft
sudo update-alternatives --set arptables /usr/sbin/arptables-nft 2>/dev/null || true
sudo update-alternatives --set ebtables /usr/sbin/ebtables-nft 2>/dev/null || true

echo "=== Step 3: Remove stale Docker networks/bridges ==="
docker network prune -f || true
sudo ip link delete docker0 2>/dev/null || true

echo "=== Step 4: Start Docker ==="
sudo systemctl start docker

echo "=== Step 5: Verify ==="
iptables --version
ip6tables --version
docker info | grep -i -E "Firewall Backend|iptables"

echo "=== Step 6: Retry compose ==="
cd /home/snfib/ForceRare
docker compose up -d

echo "=== Done ==="
