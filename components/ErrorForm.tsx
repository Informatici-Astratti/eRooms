interface ErrorFormProps{
    errors: string | string[] | undefined  
}

const ErrorForm: React.FC<ErrorFormProps> = ({ errors }) => {
    const errorList = Array.isArray(errors) ? errors : [errors];

    return (
        <ul className="text-sm text-red-500">
            {errorList.map((error, index) => (
                <li key={index}>{error}</li>
            ))}
        </ul>
    );
}

export default ErrorForm;