import { OrderStatus } from "../libs/enums/order.enum";
import OrderModel  from "../schema/Order.model";
import ProductModel from "../schema/Product.model";
import MemberModel from "../schema/Member.model";
import { ProductStatus } from "../libs/enums/product.enum";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";

export interface AdminStats {
    todayRevenue: number;
    todayOrders: number;
    activeProducts: number;
    activeUsers: number;
}

export interface ActivityItem {
    type: 'order' | 'product' | 'user';
    action: 'created' | 'completed' | 'deleted' | 'blocked' | 'activated';
    label: string;
    time: string;
}

export interface AlertItem {
    type: 'product' | 'user';
    message: string;
    redirectTo: string;
}

class DashboardService{
    private readonly orderModel;
    private readonly productModel;
    private readonly memberModel;
    
    constructor(){
        this.orderModel = OrderModel;
        this.productModel = ProductModel;
        this.memberModel = MemberModel;
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

    public async getTodayStats(): Promise<AdminStats> {
        try {
            // Get today's start and end dates
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            // Today's revenue and orders
            const todayOrdersData = await this.orderModel.aggregate([
                {
                    $match: {
                        createdAt: { $gte: today, $lt: tomorrow },
                        orderStatus: OrderStatus.FINISH
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$orderTotal" },
                        orderCount: { $sum: 1 }
                    }
                }
            ]);

            const todayRevenue = todayOrdersData.length > 0 && todayOrdersData[0].totalRevenue ? todayOrdersData[0].totalRevenue : 0;
            const todayOrders = todayOrdersData.length > 0 && todayOrdersData[0].orderCount ? todayOrdersData[0].orderCount : 0;

            // Active products count
            const activeProducts = await this.productModel.countDocuments({
                productStatus: ProductStatus.PROCESS
            }).exec() || 0;

            // Active users count
            const activeUsers = await this.memberModel.countDocuments({
                memberType: MemberType.USER,
                memberStatus: MemberStatus.ACTIVE
            }).exec() || 0;

            return {
                todayRevenue: Number(todayRevenue),
                todayOrders: Number(todayOrders),
                activeProducts: Number(activeProducts),
                activeUsers: Number(activeUsers)
            };
        } catch (error) {
            console.error('Error in getTodayStats:', error);
            throw error;
        }
    }

    public async getTodayActivity(): Promise<ActivityItem[]> {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            console.log('getTodayActivity - Today range:', today.toISOString(), 'to', tomorrow.toISOString());
            console.log('getTodayActivity - Current time:', new Date().toISOString());

            const activities: Array<ActivityItem & { timestamp: Date }> = [];

            // Get orders created today
            const ordersCreated = await this.orderModel.find({
                createdAt: { $gte: today, $lt: tomorrow }
            }).sort({ createdAt: -1 }).limit(5).exec();
            
            console.log('getTodayActivity - Orders created today:', ordersCreated.length);

            ordersCreated.forEach(order => {
                const time = new Date(order.createdAt).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });
                activities.push({
                    type: 'order',
                    action: 'created',
                    label: `Order #${order._id.toString().slice(-4)} created`,
                    time: time,
                    timestamp: order.createdAt
                });
            });

            // Get orders completed today
            const ordersCompleted = await this.orderModel.find({
                updatedAt: { $gte: today, $lt: tomorrow },
                orderStatus: OrderStatus.FINISH
            }).sort({ updatedAt: -1 }).limit(5).exec();
            
            console.log('getTodayActivity - Orders completed today:', ordersCompleted.length);

            ordersCompleted.forEach(order => {
                const time = new Date(order.updatedAt).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });
                activities.push({
                    type: 'order',
                    action: 'completed',
                    label: `Order #${order._id.toString().slice(-4)} completed`,
                    time: time,
                    timestamp: order.updatedAt
                });
            });

            // Get ALL products updated today (including status changes)
            // This will catch products that were updated today, regardless of when created
            const productsChanged = await this.productModel.find({
                updatedAt: { $gte: today, $lt: tomorrow }
            }).sort({ updatedAt: -1 }).limit(20).exec();

            console.log('getTodayActivity - Products updated today (total):', productsChanged.length);
            console.log('getTodayActivity - Today date:', today.toISOString());
            console.log('getTodayActivity - Tomorrow date:', tomorrow.toISOString());
            
            // Show all products found for debugging
            productsChanged.forEach(product => {
                console.log(`  - Product: ${product.productName}, Status: ${product.productStatus}, Created: ${new Date(product.createdAt).toISOString()}, Updated: ${new Date(product.updatedAt).toISOString()}`);
            });
            
            // Filter out products that were created today (we'll handle those separately)
            const productsStatusChanged = productsChanged.filter(product => {
                const createdDate = new Date(product.createdAt);
                createdDate.setHours(0, 0, 0, 0);
                const isOldProduct = createdDate.getTime() < today.getTime();
                if (!isOldProduct) {
                    console.log(`  - Skipping newly created product: ${product.productName}`);
                }
                return isOldProduct;
            });

            console.log('getTodayActivity - Products status changed today (excluding new):', productsStatusChanged.length);

            productsStatusChanged.forEach(product => {
                const timestamp = product.updatedAt;
                const time = new Date(timestamp).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });
                
                if (product.productStatus === ProductStatus.PROCESS) {
                    activities.push({
                        type: 'product',
                        action: 'activated',
                        label: `Product "${product.productName}" activated`,
                        time: time,
                        timestamp: timestamp
                    });
                } else if (product.productStatus === ProductStatus.PAUSE) {
                    activities.push({
                        type: 'product',
                        action: 'deleted',
                        label: `Product "${product.productName}" paused`,
                        time: time,
                        timestamp: timestamp
                    });
                } else if (product.productStatus === ProductStatus.DELETE) {
                    activities.push({
                        type: 'product',
                        action: 'deleted',
                        label: `Product "${product.productName}" deleted`,
                        time: time,
                        timestamp: timestamp
                    });
                }
            });

            // Get newly created products today
            const productsCreated = await this.productModel.find({
                createdAt: { $gte: today, $lt: tomorrow }
            }).sort({ createdAt: -1 }).limit(5).exec();
            
            console.log('getTodayActivity - Products created today:', productsCreated.length);

            productsCreated.forEach(product => {
                const time = new Date(product.createdAt).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });
                activities.push({
                    type: 'product',
                    action: 'activated',
                    label: `Product "${product.productName}" created`,
                    time: time,
                    timestamp: product.createdAt
                });
            });

            // Get users blocked today
            const usersBlocked = await this.memberModel.find({
                updatedAt: { $gte: today, $lt: tomorrow },
                memberStatus: MemberStatus.BLOCK
            }).sort({ updatedAt: -1 }).limit(5).exec();
            
            console.log('getTodayActivity - Users blocked today:', usersBlocked.length);

            usersBlocked.forEach(user => {
                const time = new Date(user.updatedAt).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });
                activities.push({
                    type: 'user',
                    action: 'blocked',
                    label: `User "${user.memberNick}" blocked`,
                    time: time,
                    timestamp: user.updatedAt
                });
            });

            // Sort by timestamp (most recent first) and limit to 5, then remove timestamp
            const result = activities
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .slice(0, 5)
                .map(({ timestamp, ...activity }) => activity);
            
            console.log('getTodayActivity - Found activities:', result.length);
            return result;
        } catch (error) {
            console.error('Error in getTodayActivity:', error);
            return [];
        }
    }

    public async getSystemAlerts(): Promise<AlertItem[]> {
        try {
            const alerts: AlertItem[] = [];

            // Check for inactive products (PAUSE status)
            const inactiveProducts = await this.productModel.countDocuments({
                productStatus: ProductStatus.PAUSE
            }).exec();
            
            console.log('getSystemAlerts - Inactive products (PAUSE):', inactiveProducts);
            
            // Debug: Get sample inactive products
            const sampleInactive = await this.productModel.find({
                productStatus: ProductStatus.PAUSE
            }).limit(3).exec();
            console.log('getSystemAlerts - Sample inactive products:', sampleInactive.map(p => ({
                name: p.productName,
                status: p.productStatus
            })));

            if (inactiveProducts > 0) {
                alerts.push({
                    type: 'product',
                    message: `${inactiveProducts} inactive product${inactiveProducts > 1 ? 's' : ''}`,
                    redirectTo: '/admin/product/all'
                });
            }

            // Check for deleted products (DELETE status)
            const deletedProducts = await this.productModel.countDocuments({
                productStatus: ProductStatus.DELETE
            }).exec();

            if (deletedProducts > 0) {
                alerts.push({
                    type: 'product',
                    message: `${deletedProducts} deleted product${deletedProducts > 1 ? 's' : ''}`,
                    redirectTo: '/admin/product/all'
                });
            }

            // Check for out of stock products (productLeftCount === 0 and PROCESS status)
            const outOfStockProducts = await this.productModel.countDocuments({
                productLeftCount: 0,
                productStatus: ProductStatus.PROCESS
            }).exec();

            if (outOfStockProducts > 0) {
                alerts.push({
                    type: 'product',
                    message: `${outOfStockProducts} product${outOfStockProducts > 1 ? 's' : ''} out of stock`,
                    redirectTo: '/admin/product/all'
                });
            }

            // Check for ALL blocked users (not just today)
            const blockedUsers = await this.memberModel.countDocuments({
                memberType: MemberType.USER,
                memberStatus: MemberStatus.BLOCK
            }).exec();

            if (blockedUsers > 0) {
                alerts.push({
                    type: 'user',
                    message: `${blockedUsers} blocked user${blockedUsers > 1 ? 's' : ''}`,
                    redirectTo: '/admin/user/all'
                });
            }

            // Check for ALL deleted users
            const deletedUsers = await this.memberModel.countDocuments({
                memberType: MemberType.USER,
                memberStatus: MemberStatus.DELETE
            }).exec();

            if (deletedUsers > 0) {
                alerts.push({
                    type: 'user',
                    message: `${deletedUsers} deleted user${deletedUsers > 1 ? 's' : ''}`,
                    redirectTo: '/admin/user/all'
                });
            }

            console.log('getSystemAlerts - Total alerts:', alerts.length);
            return alerts;
        } catch (error) {
            console.error('Error in getSystemAlerts:', error);
            return [];
        }
    }
}

export default DashboardService