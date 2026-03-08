import { api } from '@/utils/api';
import type { Order } from '@/types';

export function createOrder(shipping_address: Order['shipping_address'], items: { product_id: string; quantity: number }[]) {
  return api<Order>('/api/orders', { method: 'POST', body: JSON.stringify({ shipping_address, items }) });
}

export function getMyOrders() {
  return api<Order[]>('/api/orders/my-orders');
}

export function getOrderById(id: string) {
  return api<Order>(`/api/orders/${id}`);
}

export function getAllOrders() {
  return api<Order[]>('/api/orders/admin');
}

export function updateOrderStatus(orderId: string, status: Order['status']) {
  return api<Order>(`/api/orders/${orderId}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
}
