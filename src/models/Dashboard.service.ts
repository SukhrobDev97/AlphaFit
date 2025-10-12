import { OrderStatus } from "../libs/enums/order.enum";
import OrderModel  from "../schema/Order.model";

class DashboardService{
    private readonly orderModel 
    constructor(){
        this.orderModel = OrderModel
    }

    public async getMonthlySales(year: number, month: number): Promise<any[]>{
        const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const stats = await OrderModel.aggregate([
    { $match: { createdAt: { $gte: startDate, $lte: endDate }, orderStatus: OrderStatus.FINISH  } },
    { $group: { _id: { $dayOfMonth: "$createdAt" }, total: { $sum: "$orderTotal" } } },
    { $sort: { _id: 1 } }
  ]);
  return stats;
    }
}

export default DashboardService