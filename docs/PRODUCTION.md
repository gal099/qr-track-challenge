# QR Track Production Operations Guide

This guide covers monitoring, maintenance, and troubleshooting for QR Track in production.

## Monitoring

### Vercel Dashboard

Access your project's monitoring at [vercel.com/dashboard](https://vercel.com/dashboard):

- **Deployments:** View deployment history and status
- **Analytics:** Traffic and usage metrics
- **Logs:** Function execution logs
- **Speed Insights:** Performance metrics

### Key Metrics to Monitor

| Metric | Location | Healthy Range |
|--------|----------|---------------|
| Function Duration | Vercel Logs | < 1000ms |
| Error Rate | Vercel Analytics | < 1% |
| Database Connections | Vercel Storage | < 80% pool |
| Page Load Time | Speed Insights | < 3s |

### Setting Up Alerts

1. Go to Vercel Project → **Settings** → **Notifications**
2. Configure alerts for:
   - Deployment failures
   - Function errors
   - High error rates

## Logs

### Accessing Logs

1. Vercel Dashboard → Your Project
2. Click **Deployments** → Select deployment
3. Click **Functions** tab
4. View real-time and historical logs

### Log Levels

Application logs include:
- `QR generation error:` - QR code creation failures
- `Analytics fetch error:` - Analytics API issues
- `Redirect error:` - Short URL redirect problems
- `Failed to track scan:` - Scan tracking failures (non-blocking)

### Log Retention

- Vercel retains logs for 7 days on free tier
- Pro tier retains logs for 30 days
- Consider external logging for long-term retention

## Database Management

### Accessing the Database

1. Vercel Dashboard → **Storage** → Your database
2. Use the **Query** tab for ad-hoc queries
3. Use **Data Browser** to view tables

### Useful Queries

**Check QR code count:**
```sql
SELECT COUNT(*) FROM qr_codes;
```

**Check recent scans:**
```sql
SELECT * FROM scans ORDER BY scanned_at DESC LIMIT 10;
```

**Top QR codes by scans:**
```sql
SELECT qr.short_code, qr.target_url, COUNT(s.id) as scan_count
FROM qr_codes qr
LEFT JOIN scans s ON qr.id = s.qr_code_id
GROUP BY qr.id
ORDER BY scan_count DESC
LIMIT 10;
```

**Scans per day:**
```sql
SELECT DATE(scanned_at) as date, COUNT(*) as scans
FROM scans
GROUP BY DATE(scanned_at)
ORDER BY date DESC
LIMIT 30;
```

### Database Backups

Vercel Postgres includes automated backups:

- **Point-in-Time Recovery:** Available on Pro/Enterprise
- **Manual Export:**
  ```bash
  pg_dump $POSTGRES_URL > backup.sql
  ```

### Database Scaling

If you need more capacity:

1. Go to Vercel Dashboard → Storage
2. Upgrade your database plan
3. Monitor connection pool usage

## Performance Optimization

### Caching Strategies

The application uses:
- No-cache headers on API routes (real-time data)
- Browser caching for static assets
- Next.js automatic static optimization

### Database Optimization

Current optimizations:
- LIMIT clauses on all listing queries
- Indexed columns (id, short_code, qr_code_id)
- Connection pooling via @vercel/postgres

### Cold Start Mitigation

Serverless functions may experience cold starts. To minimize:

1. Keep functions small and focused
2. Minimize dependencies
3. Consider Vercel Edge Functions for latency-critical routes

## Troubleshooting

### Common Issues

#### High Function Latency

**Symptoms:** Slow page loads, timeout errors

**Diagnosis:**
1. Check Vercel function logs for slow queries
2. Review database query performance
3. Check for external API calls

**Solutions:**
- Optimize database queries
- Add database indexes if needed
- Consider caching frequently accessed data

#### Database Connection Pool Exhaustion

**Symptoms:** "Too many connections" errors

**Diagnosis:**
1. Check connection count in Vercel Storage dashboard
2. Look for connection leaks in logs

**Solutions:**
- @vercel/postgres handles pooling automatically
- Reduce concurrent function invocations if needed
- Contact Vercel support for pool limit increase

#### Memory Issues

**Symptoms:** Function crashes, out-of-memory errors

**Diagnosis:**
1. Check memory usage in Vercel logs
2. Look for large data processing operations

**Solutions:**
- Stream large data instead of loading into memory
- Increase function memory allocation
- Optimize image/QR code generation

### Debug Mode

For local debugging with production data:

```bash
# Pull production env vars
vercel env pull .env.local

# Run local server
npm run dev
```

## Rollback Procedures

### Quick Rollback

1. Go to Vercel Dashboard → **Deployments**
2. Find the last working deployment
3. Click **"..."** → **"Promote to Production"**

### Database Rollback

If a migration caused issues:

1. Access database via Vercel Query tab
2. Run rollback SQL or restore from backup
3. Redeploy previous code version

## Scaling Considerations

### Current Limits

| Resource | Free Tier | Pro Tier |
|----------|-----------|----------|
| Bandwidth | 100GB/mo | 1TB/mo |
| Function Duration | 10s | 60s |
| Database Storage | 256MB | 10GB |
| Concurrent Connections | 20 | 100 |

### When to Scale

Consider upgrading when:
- Approaching bandwidth limits
- Database storage near capacity
- Function timeouts occurring
- Need more concurrent connections

## Security

### Regular Security Tasks

- [ ] Review Vercel access permissions monthly
- [ ] Rotate database credentials if compromised
- [ ] Monitor for unusual traffic patterns
- [ ] Keep dependencies updated

### Security Headers

The application sets these headers via `vercel.json`:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### Data Privacy

- IP addresses are truncated for privacy
- User agents are stored for analytics only
- No personal data is collected

## Maintenance Windows

### Planned Maintenance

For database maintenance:

1. Announce maintenance window to users
2. Enable maintenance mode (optional)
3. Perform maintenance
4. Verify functionality
5. Announce completion

### Zero-Downtime Updates

Vercel provides zero-downtime deployments:
- New deployment builds while old serves traffic
- Traffic switches to new deployment atomically
- Rollback available if issues detected

## Contact & Support

- **Vercel Support:** [vercel.com/support](https://vercel.com/support)
- **Next.js Docs:** [nextjs.org/docs](https://nextjs.org/docs)
- **Project Issues:** Open an issue in the repository
