build:
	hugo --gc --minify --templateMetrics --templateMetricsHints --forceSyncStatic
preview:
	hugo server --disableFastRender --navigateToChanged --templateMetrics --templateMetricsHints --watch --forceSyncStatic -e production --minify --bind 0.0.0.0
serve:
	hugo server  --bind 0.0.0.0
