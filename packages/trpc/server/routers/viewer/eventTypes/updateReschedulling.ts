import { TRPCClientErrorLike } from '@trpc/client';
import { trpc } from '@calcom/trpc/react';
import type { AppRouter } from '@calcom/trpc/server/routers/_app';

type UpdateReschedulingInput = {
    id: number;
    allowRescheduling: {
        enabled: boolean;
        maxHours?: number | null;
        maxDays?: number | null;
    };
};

export const useUpdateRescheduling = () => {
    const utils = trpc.useContext();

    return trpc.viewer.eventTypes.update.useMutation<UpdateReschedulingInput, TRPCClientErrorLike<AppRouter>>({
        onSuccess: () => {
            utils.viewer.eventTypes.get.invalidate();
        },
        onError: (error) => {
            console.error('Error updating rescheduling settings:', error);
        },
    });
};

export const updateRescheduling = async (
    input: UpdateReschedulingInput
): Promise<void> => {
    const mutation = useUpdateRescheduling();

    try {
        await mutation.mutateAsync(input);
    } catch (error) {
        console.error('Failed to update rescheduling settings:', error);
        throw error;
    }
};