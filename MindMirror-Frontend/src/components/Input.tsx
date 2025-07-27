
interface InputProps {
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string; // Optional prop to specify input type

}

function Input({ placeholder, value, onChange, type }: InputProps) {
    return <div>
        <input value={value}
            onChange={onChange}
            placeholder={placeholder}
            type={type} className="px-4 py-2 border m-2 rounded" />
    </div>
}
export default Input;