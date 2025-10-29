# TODO: Implement User Roles with Store Separation

## Model Changes

- [x] Add Store model with fields: id, name, address, logo_url, contact_number, description, manager_id (FK to User), created_at, updated_at
- [x] Add store_id to Product model
- [x] Add store_id to Order model
- [x] Ensure one manager = one store (unique constraint on manager_id)

## Backend Changes

- [ ] Update auth.py: Remove auto super_admin assignment; managers invited only
- [ ] Update dashboard.py: Filter data by store for managers (products, orders, analytics)
- [ ] Add store management routes (create, update store profile)
- [ ] Update product/order creation to associate with manager's store
- [ ] Update routes/products.py if needed for store association

## Frontend Changes

- [ ] Update UserManagement: Add store fields when creating managers
- [ ] Add store profile page for managers to edit details
- [ ] Update Collections/HomePage: Display products with store names
- [ ] Update ManagerDashboard: Show store-specific analytics/orders
- [ ] Ensure routing and access control in App.jsx

## Migrations

- [ ] Create Alembic migration for new Store model and added fields

## Followup Steps

- [ ] Run database migrations
- [ ] Test role-based access and store separation
- [ ] Verify customer unified catalog with store names
