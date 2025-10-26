
Collections:
- users { _id, role: 'admin'|'agent'|'customer', phone, email?, fullName?, wallet{pending,paid,balance}, commission{type:'percent'|'fixed', value}, createdAt }
- products { _id, sku, title, slug, price, salePrice?, active, isGroupBuy, groupTarget, groupJoined, groupDepositPercent, groupDeadline, media{cover,gallery:[]}, createdAt }
- referralLinks { _id, agentId, productId, code, url, utm, createdAt }
- visits { _id, refCode, productId, agentId, utm, ua, ip, ts }
- orders { _id, productId, agentId, refCode, customer{name,phone,email?}, amount, currency, status, source{utm,platform}, payplus{transactionId?, raw?}, ts }
- commissions { _id, agentId, orderId, basisAmount, rule{type,value}, commissionAmount, status, ts }
- groupOrders { _id, productId, agentId, customer{name,phone}, depositAmount, depositPaid, finalPaymentStatus, subscribedToUpdates, joinedAt }
- themes { _id, active, baseThemeName, vars, componentOverrides, updatedAt }
- notifications { _id, type:'whatsapp', audience:{ type:'all'|'agents'|'customers'|'group', productId? }, payload{text,media?}, scheduleAt, status, stats, createdBy, createdAt }
