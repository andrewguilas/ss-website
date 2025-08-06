export default function ErrorMessage({ error }: { error: string | null }) {
    if (!error) return null
    return <p className="text-red-600">{error}</p>
}