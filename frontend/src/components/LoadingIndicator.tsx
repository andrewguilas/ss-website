export default function LoadingIndicator({ message = "Loading..." }: { message?: string }) {
    return <p className="text-gray-500">{message}</p>
}