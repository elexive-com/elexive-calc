# Amplify Usage Guidance (Project Stance)

This file supplements the vendor Amplify reference docs (`amplify-*.md`). It does not modify or supersede them.

## Authorization Stance

- Prefer Cognito + `allow.guest()` for unauthenticated access when Cognito is present.
- Limit `allow.publicApiKey()` strictly to demo-only scenarios and avoid it if Cognito exists.
- Do not use `.public()` (ambiguous/deprecated patterns).

## Practical Reminders

- `loginWith` supports only `email` and `phone`.
- Keep `userAttributes` outside `loginWith`.
- `externalProviders` must contain `callbackUrls` and `logoutUrls`.
- Store provider credentials in AWS Secrets Manager/SSM; never commit secrets.

## TypeScript & Consistency

- Use strict types in examples; favor the object form for `userAttributes` for clarity.
- Keep examples aligned to the current Amplify Gen 2 TypeScript APIs.

## References (Do Not Modify)

- `amplify-authentication.md`
- `amplify-modeling-schema.md`
- `amplify-modeling-relationships.md`
- `amplify-general.md`

