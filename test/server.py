#!/usr/bin/env python3
from http.server import HTTPServer, SimpleHTTPRequestHandler
import socketserver

class CORSRequestHandler (SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory="./public/", **kwargs)

    def end_headers (self):
        self.send_header('Access-Control-Allow-Origin', '*')
        SimpleHTTPRequestHandler.end_headers(self)

PORT = 9090

handler = CORSRequestHandler

if __name__ == '__main__':
  with socketserver.TCPServer(("", PORT), handler) as httpd:
    print("Serving at port", PORT)
    httpd.serve_forever()
