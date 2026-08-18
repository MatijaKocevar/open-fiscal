namespace FursBridge.Interfaces;

public interface IJwsSigner
{
    string Sign(string payloadJson);
}
