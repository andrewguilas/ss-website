export interface Truck {
  id: number
  model: string | null
  comments: string | null
}

{/*
  id    Id
  campus    Campus
  name    Name
  phone   Phone
  pronunciation   Pronunciation
  comments    Comments
  pickup_date   PickupDate
  pickup_location   PickupLocation
  pickup_proxy_name   PickupProxyName
  pickup_proxy_phone    PickupProxyPhone
  dropoff_date    DropoffDate
  dropoff_location    DropoffLocation
  dropoff_proxy_name    DropoffProxyName
  dropoff_proxy_phone   DropoffProxyPhone
  item_count    ItemCount
  items   Items
  route_id    RouteId
*/}

export interface Route {
  id: number
  date: string
  driver_name: string | null
  comments: string | null
  truck_id: number | null
}

export interface Order {
  id: number
  campus: string
  name: string
  phone: string | null
  pronunciation: string | null
  comments: string | null
  pickup_date: string | null
  pickup_location: string | null
  pickup_proxy_name: string | null
  pickup_proxy_phone: string | null
  dropoff_date: string | null
  dropoff_location: string | null
  dropoff_proxy_name: string | null
  dropoff_proxy_phone: string | null
  item_count: number | null
  items: string | null
  route_id: number | null
}
