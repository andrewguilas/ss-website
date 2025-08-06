export interface Truck {
  id: number
  model: string | null
  comments: string | null
}

export interface Route {
  id: number
  date: string
  driver_name: string | null
  comments: string | null
  truck_id: number | null
}

{/*
  id    Id
  date    Date
  driver_name   DriverName
  comments    Comments
  truck_id    TruckId
*/}

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
