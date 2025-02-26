

// middleware protect educator routes
import {clerkClient} from "@clerk/express";

export const protectEducator = async (request, response, next) => {
    try {
        const userId = request.auth.userId;
        const response = await clerkClient.users.getUser(userId)
        // get user from clerk-client via id of it
        // ensuring that only educator be able to add courses
        if (response.publicMetadata.role !== 'educator') {
            return response.json({success:false, message: 'Недостаточно прав!'})
        }
        next()

    } catch (error) {
        response.json({success: false, message: error.message})
    }

}