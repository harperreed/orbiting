# Apple App Site Association (AASA) File Specification

## Purpose
Links the domain `orbiting.com` to the Orbiting app and App Clip for digital invocations.

## File Location
Must be hosted at:
```
https://orbiting.com/.well-known/apple-app-site-association
```

## File Content Template

```json
{
  "appclips": {
    "apps": ["N9TDHQ977J.com.harperrules.Orbiting.Clip"]
  },
  "applinks": {
    "apps": [],
    "details": [
      {
        "appIDs": [
          "N9TDHQ977J.com.harperrules.Orbiting",
          "N9TDHQ977J.com.harperrules.Orbiting.Clip"
        ],
        "components": [
          {
            "/": "/clip/*",
            "comment": "App Clip invocation URLs"
          }
        ]
      }
    ]
  }
}
```

## Important Notes

1. **Team ID**: Replace `N9TDHQ977J` with your actual Apple Developer Team ID
   - Find in: Apple Developer Portal → Membership → Team ID
   - Current placeholder: `N9TDHQ977J`

2. **Domain**: Must use `orbiting.com` (NOT `orbiting.app`)
   - Main domain for hosting the AASA file

3. **No File Extension**: File must be named `apple-app-site-association` (no .json)

4. **MIME Type**: Serve with `application/json` content type

5. **HTTPS Required**: Must be served over HTTPS with valid certificate

6. **No Redirects**: File must be directly accessible, no 301/302 redirects

7. **Case Sensitive**: Path is case-sensitive: `/.well-known/` not `/.Well-Known/`

## Validation Instructions

### Step 1: Verify File Access
```bash
curl -v https://orbiting.com/.well-known/apple-app-site-association
```

Expected:
- HTTP 200 status
- Content-Type: application/json
- Valid JSON response

### Step 2: Check HTTPS Certificate
```bash
openssl s_client -connect orbiting.com:443 -servername orbiting.com
```

Expected: Valid SSL certificate with no errors

### Step 3: Use Apple's Validation Tool
1. Visit: https://search.developer.apple.com/appsearch-validation-tool/
2. Enter URL: `https://orbiting.com/.well-known/apple-app-site-association`
3. Click "Validate"

Expected: "No errors found" message

### Step 4: Test with Device
1. Open Safari on iOS device
2. Navigate to `https://orbiting.com/clip`
3. Look for App Clip card or Smart Banner at top of page

Expected: App Clip invocation card appears

## Deployment Steps

### Prerequisites
- Access to `orbiting.com` web server
- Ability to deploy files to `/.well-known/` directory
- HTTPS configured with valid certificate

### Deployment Process

1. **Obtain Team ID**
   - Log in to https://developer.apple.com/account
   - Navigate to Membership section
   - Copy Team ID (10-character alphanumeric)

2. **Update JSON Template**
   - Replace all instances of `N9TDHQ977J` with your Team ID
   - Verify bundle identifiers match:
     - Main app: `com.harperrules.Orbiting`
     - App Clip: `com.harperrules.Orbiting.Clip`

3. **Deploy File**
   ```bash
   # Example deployment (adjust for your hosting setup)
   scp apple-app-site-association user@orbiting.com:/var/www/orbiting.com/.well-known/
   ```

4. **Set Correct Permissions**
   ```bash
   chmod 644 apple-app-site-association
   ```

5. **Configure Web Server**

   **For Nginx:**
   ```nginx
   location /.well-known/apple-app-site-association {
       default_type application/json;
       add_header Access-Control-Allow-Origin *;
   }
   ```

   **For Apache:**
   ```apache
   <Files "apple-app-site-association">
       Header set Content-Type "application/json"
       Header set Access-Control-Allow-Origin "*"
   </Files>
   ```

6. **Reload Web Server**
   ```bash
   # Nginx
   sudo nginx -t && sudo systemctl reload nginx

   # Apache
   sudo apachectl configtest && sudo systemctl reload apache2
   ```

7. **Verify Deployment**
   - Run validation steps above
   - Wait 15-30 minutes for CDN propagation if applicable

8. **Update DNS (if needed)**
   - Ensure `orbiting.com` resolves correctly
   - May take 24-48 hours for global DNS propagation

## Troubleshooting

### Problem: File not accessible
**Solution**: Check web server logs, verify path and permissions

### Problem: Wrong Content-Type
**Solution**: Update web server config to serve as `application/json`

### Problem: Certificate errors
**Solution**: Ensure valid HTTPS certificate from trusted CA (Let's Encrypt, etc.)

### Problem: Apple validation fails
**Solution**:
- Verify JSON syntax with `jq` or online validator
- Check for hidden characters or BOM
- Ensure no trailing commas in JSON

### Problem: App Clip doesn't trigger from Safari
**Solution**:
- Wait 24-48 hours after AASA deployment
- Clear Safari cache on test device
- Verify entitlements match domain in Xcode

## Status Checklist

- [ ] Obtain Team ID from Apple Developer Portal
- [ ] Update JSON template with actual Team ID
- [ ] Deploy file to `https://orbiting.com/.well-known/apple-app-site-association`
- [ ] Verify file accessible via curl
- [ ] Verify HTTPS certificate valid
- [ ] Validate with Apple's tool
- [ ] Test Safari invocation on device
- [ ] Update DNS if domain changes needed
- [ ] Wait 24-48 hours for propagation
- [ ] Document deployed Team ID in secure location

## Security Considerations

1. **Team ID is not sensitive** - It's visible in app bundles and public
2. **Bundle IDs must match** - Any mismatch prevents association
3. **HTTPS is mandatory** - iOS will not fetch over HTTP
4. **CORS headers recommended** - Add `Access-Control-Allow-Origin: *` for debugging

## References

- [Apple Documentation: Supporting Associated Domains](https://developer.apple.com/documentation/xcode/supporting-associated-domains)
- [Apple Documentation: App Clips](https://developer.apple.com/app-clips/)
- [AASA Validation Tool](https://search.developer.apple.com/appsearch-validation-tool/)

## Related Documentation

- App Clip spec: `docs/app-clip-spec.md`
- Testing strategy: `docs/app-clip-testing.md`
- Icon requirements: `docs/app-clip-icon-requirements.md`
- Implementation summary: `docs/app-clip-implementation-complete.md`

---

**Last Updated**: 2025-10-13
**Status**: Template ready, awaiting Team ID and deployment
