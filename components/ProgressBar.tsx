import { memo } from "react";
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
    value: number;
}

const ProgressBar: React.FC<ProgressBarProps> = memo(({ value }) => {
    console.log('Rendering ProgressBar. Value:', value);
    return (
        <div className="w-full">
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Uploading...</span>
                <span className="text-sm font-medium">{`${Math.round(value)}%`}</span>
            </div>
            <Progress value={value} className="w-full" />
        </div>
    );
});

export default ProgressBar;