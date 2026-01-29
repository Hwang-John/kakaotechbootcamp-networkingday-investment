import http.server
import os
import socketserver

ROOT = r"c:\Users\goorm\kakaotechbootcamp-networkingday-investment"
HOST = "127.0.0.1"
PORT = 8040

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        # Avoid broken-pipe issues when stdout/stderr are detached
        pass

if __name__ == "__main__":
    os.chdir(ROOT)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer((HOST, PORT), QuietHandler) as httpd:
        httpd.serve_forever()
