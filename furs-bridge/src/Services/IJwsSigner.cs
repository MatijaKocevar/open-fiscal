namespace Bridge.Services;

public interface IJwsSigner
{
    string Sign(string payloadJson);
}
