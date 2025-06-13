FROM prom/prometheus:latest

# Copy cấu hình Prometheus
COPY prometheus.yml /etc/prometheus/prometheus.yml

# Expose cổng Prometheus (mặc định là 9090)
EXPOSE 9090

CMD ["--config.file=/etc/prometheus/prometheus.yml"]
