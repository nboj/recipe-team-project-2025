import Section from "../_components/Section";

export default function Create() {
    return (
        <Section title="Create Recipe">
            <p className="mb-4">We’ll wire this form up next.</p>
            <form className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                <label className="block text-sm font-medium">Title</label>
                <input
                    className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                    placeholder="e.g., Spicy Peanut Noodles"
                />
                <button
                    className="mt-4 bg-slate-900 text-white rounded px-4 py-2 opacity-60 cursor-not-allowed"
                    disabled
                >
                    Save (not wired yet)
                </button>
            </form>
        </Section>
    );
}
