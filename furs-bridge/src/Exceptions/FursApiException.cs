namespace FursBridge.Exceptions;

public class FursApiException : Exception
{
    public string Code { get; }

    public FursApiException(string code, string message) : base(message)
    {
        Code = code;
    }
}
