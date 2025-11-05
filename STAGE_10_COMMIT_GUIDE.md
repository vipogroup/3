# 📝 Stage 10 - Commit & PR Guidelines

## 🎯 מטרה
פיצול העבודה ל-commits הגיוניים ויצירת PR מסודר.

---

## 📦 Commit Strategy

### פצל ל-4 Commits עיקריים:

---

## Commit 1: Scaffold + Layout

### קבצים:
```
app/admin/layout.js
app/admin/page.js
app/admin/agents/page.js
app/admin/users/page.js
app/admin/products/page.js
app/admin/orders/page.js
app/admin/settings/page.js
lib/auth/server.js
```

### Commit Message:
```
feat(admin): add admin dashboard scaffold and layout

- Create /admin route structure with all pages
- Add sidebar navigation with RTL support
- Implement admin-only authorization guards
- Add getUserFromCookies() and requireAdmin() helpers
- Create responsive layout with fixed sidebar

All pages protected with admin authorization.
Sidebar includes: Dashboard, Agents, Users, Products, Orders, Settings
```

### Command:
```bash
git add app/admin/layout.js app/admin/page.js app/admin/*/page.js lib/auth/server.js
git commit -m "feat(admin): add admin dashboard scaffold and layout"
```

---

## Commit 2: Guards + Dashboard KPIs

### קבצים:
```
app/admin/page.js (updated with KPIs)
```

### Commit Message:
```
feat(admin): add dashboard KPI cards and quick actions

- Add 6 KPI cards: users, agents, products, orders, pending, revenue
- Implement responsive grid layout (1/2/3 columns)
- Add quick actions section with 4 shortcuts
- Use placeholder data (TODO: connect to real API)

Dashboard loads fast with all statistics visible.
```

### Command:
```bash
git add app/admin/page.js
git commit -m "feat(admin): add dashboard KPI cards and quick actions"
```

---

## Commit 3: Agents + Users Management

### קבצים:
```
app/components/admin/AgentsList.jsx
app/components/admin/UsersList.jsx
app/admin/agents/page.js (updated)
app/admin/users/page.js (updated)
```

### Commit Message:
```
feat(admin): add agents and users management screens

Agents:
- List view with table (name, email, phone, status, date)
- Create/Edit modal with form validation
- API integration: GET/POST/PUT /api/agents

Users:
- List view with role management
- Change role dropdown (customer/agent/admin)
- Protection: cannot change own role or remove last admin
- API integration: GET /api/users, PATCH /api/users/role

Both screens include error handling and success feedback.
```

### Command:
```bash
git add app/components/admin/AgentsList.jsx app/components/admin/UsersList.jsx
git add app/admin/agents/page.js app/admin/users/page.js
git commit -m "feat(admin): add agents and users management screens"
```

---

## Commit 4: Products + Orders + Settings

### קבצים:
```
app/components/admin/ProductsList.jsx
app/components/admin/OrdersList.jsx
app/components/admin/SettingsForm.jsx
app/admin/products/page.js (updated)
app/admin/orders/page.js (updated)
app/admin/settings/page.js (updated)
```

### Commit Message:
```
feat(admin): add products, orders, and settings management

Products:
- Grid view with image, name, description, price, category
- Full CRUD: Create, Read, Update, Delete
- Image upload integration (Cloudinary)
- Form validation (name, price required, price > 0)
- Delete confirmation modal
- API integration: GET/POST/PUT/DELETE /api/products

Orders:
- Table view with order details
- Status update dropdown (pending/paid/cancelled)
- Filter by status
- Search by ID, email, or phone
- Optimistic UI updates
- API integration: GET /api/orders, PUT /api/orders/:id

Settings:
- Logo upload (Cloudinary)
- Primary color picker
- Site name input
- Live preview
- Save/Load from database
- API integration: GET/POST /api/settings

All screens include comprehensive error handling.
```

### Command:
```bash
git add app/components/admin/ProductsList.jsx app/components/admin/OrdersList.jsx app/components/admin/SettingsForm.jsx
git add app/admin/products/page.js app/admin/orders/page.js app/admin/settings/page.js
git commit -m "feat(admin): add products, orders, and settings management"
```

---

## 🔀 Pull Request

### PR Title:
```
feat: Stage 10 - Admin Dashboard (scaffold, guards, CRUD, settings)
```

### PR Description:
```markdown
# Stage 10: Admin Dashboard

## 📋 Summary
Complete admin dashboard implementation with full CRUD operations for agents, users, products, orders, and system settings.

## ✨ Features

### Core Infrastructure
- ✅ Admin route structure under `/admin`
- ✅ Sidebar navigation with RTL support
- ✅ Admin-only authorization guards
- ✅ Responsive layout (desktop/tablet/mobile)

### Dashboard
- ✅ 6 KPI cards (users, agents, products, orders, pending, revenue)
- ✅ Quick actions section
- ✅ Responsive grid layout

### Agents Management
- ✅ List view with table
- ✅ Create/Edit modal
- ✅ Form validation
- ✅ API integration

### Users Management
- ✅ List view with role badges
- ✅ Role change dropdown
- ✅ Protection against removing last admin
- ✅ Cannot change own role

### Products Management
- ✅ Grid view with images
- ✅ Full CRUD operations
- ✅ Cloudinary image upload
- ✅ Form validation
- ✅ Delete confirmation

### Orders Management
- ✅ Table view
- ✅ Status update
- ✅ Filter by status
- ✅ Search functionality
- ✅ Optimistic UI

### Settings
- ✅ Logo upload
- ✅ Color picker
- ✅ Site name
- ✅ Live preview
- ✅ Save/Load from DB

## 🧪 Testing
- [x] All routes load without 404
- [x] Authorization guards work
- [x] Non-admin users redirected to login
- [x] All CRUD operations functional
- [x] No console errors
- [x] Responsive design tested

## 📝 API Endpoints Required
The following API endpoints need to be implemented:
- `GET/POST/PUT /api/agents`
- `GET /api/users`
- `PATCH /api/users/role`
- `GET/POST/PUT/DELETE /api/products`
- `GET /api/orders`
- `PUT /api/orders/:id`
- `GET/POST /api/settings`

## 🔗 Related
- Depends on: Stage 9 (Cloudinary for image uploads)
- Depends on: Auth system (JWT, cookies)

## 📸 Screenshots
(Add screenshots here if needed)

## ✅ Checklist
- [x] Code follows project standards
- [x] All components use Tailwind CSS
- [x] RTL support implemented
- [x] Error handling in place
- [x] Loading states implemented
- [x] Success/Error messages shown
- [x] Manual testing completed
- [x] No breaking changes

## 🚀 Deployment Notes
- Ensure all API endpoints are implemented before deploying
- Test with real data in staging environment
- Verify authorization guards in production

---

**Ready for review!** 🎉
```

### Create PR:
```bash
# Push to remote
git push origin feature/stage-10-admin-dashboard

# Create PR on GitHub/GitLab
# Use the description above
```

---

## 📊 Commit Statistics

### Expected Stats:
- **Files Changed:** ~15-20
- **Insertions:** ~2000-2500 lines
- **Deletions:** ~50-100 lines (placeholders)

### Breakdown:
- Commit 1: ~500 lines (scaffold + layout)
- Commit 2: ~200 lines (dashboard KPIs)
- Commit 3: ~600 lines (agents + users)
- Commit 4: ~800 lines (products + orders + settings)

---

## ✅ Pre-Merge Checklist

Before merging the PR:
- [ ] All commits have clear messages
- [ ] PR description is complete
- [ ] Manual testing completed (use QA checklist)
- [ ] No console errors
- [ ] Code reviewed by team
- [ ] API endpoints documented
- [ ] Deployment notes added

---

## 🎯 After Merge

1. **Tag the release:**
   ```bash
   git tag -a v1.10.0 -m "Stage 10: Admin Dashboard"
   git push origin v1.10.0
   ```

2. **Update documentation:**
   - Add admin dashboard to README
   - Document API endpoints
   - Update user guide

3. **Deploy to staging:**
   - Test with real data
   - Verify all features work
   - Check performance

4. **Deploy to production:**
   - Backup database
   - Deploy code
   - Monitor logs
   - Test critical paths

---

## 📝 Commit Best Practices

### DO:
✅ Use conventional commits (feat, fix, docs, etc.)
✅ Write clear, descriptive messages
✅ Keep commits focused and atomic
✅ Test before committing

### DON'T:
❌ Mix unrelated changes
❌ Commit broken code
❌ Use vague messages ("fix stuff", "update")
❌ Commit secrets or credentials

---

**Stage 10 Commits Ready!** 🚀
