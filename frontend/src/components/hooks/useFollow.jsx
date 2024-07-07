import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";


const useFollow = () => {
    const queryClient = useQueryClient();

    const { mutate: follow, isPending } = useMutation({
        mutationFn: async (userId) => {
            try {
                const res = await axios.post(`/api/users/follow/${userId}`)
                const data = res.data
                if (res.status !== 200) {
                    throw new Error(data.error || "something went wrong")
                }
                return
            } catch (error) {
                throw new Error(error.message)
            }
        },
        onSuccess: () => {
            Promise.all([
                queryClient.invalidateQueries({ queryKey: ['suggestedUsers'] }),
                queryClient.invalidateQueries({ queryKey: ['authUser'] }),
            ])
            toast.success("followed user successfully")
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })
    return { follow, isPending }
}

export default useFollow