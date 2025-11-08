# Task Completion Checklist

When completing a coding task, perform the following steps:

## 1. Type Checking
```bash
npm run build
```
- Ensure TypeScript compilation succeeds
- Fix any type errors before proceeding

## 2. Linting
```bash
npm run lint
```
- Run ESLint to check code quality
- Fix linting errors and warnings
- Ensure code follows style guidelines

## 3. Testing
```bash
npm test
```
- Run all tests to ensure nothing broke
- Add new tests for new functionality
- Ensure test coverage for critical paths

## 4. Manual Testing (when applicable)

### Frontend Changes
```bash
# Terminal 1
npm run dev

# Terminal 2  
npm run server
```
- Test in browser at `http://localhost:5173`
- Verify UI works as expected
- Test responsive design (mobile/tablet/desktop)
- Check browser console for errors

### Backend Changes
- Test API endpoints using tools or frontend
- Verify error handling
- Check server logs for issues

## 5. File Organization
- Remove unused imports
- Delete commented-out code
- Ensure files are in correct directories
- Check that new files follow naming conventions

## 6. Documentation (if needed)
- Update README if adding new features
- Update API docs if changing endpoints
- Add/update TSDoc comments for public APIs
- Update design system docs if adding new design tokens

## 7. Git
```bash
git status                    # Check what changed
git add .                     # Stage changes
git commit -m "message"       # Commit with descriptive message
```

## 8. Performance (for significant changes)
```bash
npm run test:perf:all        # Run performance tests if applicable
```

## Quick Checklist
- [ ] TypeScript compilation passes
- [ ] Linter passes with no errors
- [ ] All tests pass
- [ ] Manual testing completed (if UI changes)
- [ ] Code follows project conventions
- [ ] No console errors
- [ ] Documentation updated (if needed)
- [ ] Changes committed to git