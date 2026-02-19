import pyotp
import qrcode
import io
import base64

class TwoFactorService:
    @staticmethod
    def generate_secret():
        """Generate a new random secret for 2FA."""
        return pyotp.random_base32()

    @staticmethod
    def get_provisioning_uri(email, secret, issuer_name="CareerSense AI"):
        """Get the provisioning URI for a QR code."""
        return pyotp.totp.TOTP(secret).provisioning_uri(name=email, issuer_name=issuer_name)

    @staticmethod
    def verify_code(secret, code):
        """Verify a TOTP code against a secret."""
        totp = pyotp.totp.TOTP(secret)
        return totp.verify(code, valid_window=1)

    @staticmethod
    def get_qr_base64(provisioning_uri):
        """Generate a base64 encoded QR code image."""
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(provisioning_uri)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        return base64.b64encode(buffered.getvalue()).decode()

two_fa_service = TwoFactorService()
