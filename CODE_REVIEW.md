# Code Review Guidelines

## Purpose

Ensure code quality, consistency, and knowledge sharing across the team.

## Review Checklist

### Code Quality

- [ ] Code follows project style guide (ESLint/Prettier)
- [ ] No console.log or debugging code
- [ ] Proper error handling
- [ ] Code is DRY (Don't Repeat Yourself)
- [ ] Functions are single-purpose and well-named

### Testing

- [ ] Unit tests written for new features
- [ ] All tests pass
- [ ] Coverage meets minimum threshold (80%)

### Security

- [ ] No sensitive data in code
- [ ] Input validation implemented
- [ ] SQL injection protected
- [ ] XSS vulnerabilities addressed

### Performance

- [ ] No unnecessary re-renders (Frontend)
- [ ] Database queries optimized
- [ ] Caching implemented where appropriate
- [ ] Large operations are async

### Documentation

- [ ] README updated if needed
- [ ] Complex logic has comments
- [ ] API endpoints documented
- [ ] Breaking changes noted

## Review Process

1. **Self-Review**: Author reviews their own code first
2. **Peer Review**: At least one team member reviews
3. **Testing**: Reviewer tests the changes locally
4. **Approval**: Reviews approve or request changes
5. **Merge**: Only after all checks pass

## Best Practices

- Keep PRs small and focused
- Respond to feedback promptly
- Be constructive in feedback
- Ask questions to understand context
