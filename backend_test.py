#!/usr/bin/env python3
"""
Backend API Testing Suite for CrimeConnect
Tests the minimal FastAPI service endpoints and functionality
"""

import requests
import json
import sys
from typing import Dict, Any

class BackendTester:
    def __init__(self):
        self.frontend_proxy_url = "http://localhost:3000"
        self.backend_direct_url = "http://localhost:8001"
        self.results = []
        
    def log_result(self, test_name: str, passed: bool, details: str = ""):
        """Log test result"""
        status = "PASS" if passed else "FAIL"
        result = f"[{status}] {test_name}"
        if details:
            result += f" - {details}"
        print(result)
        self.results.append({
            "test": test_name,
            "passed": passed,
            "details": details
        })
        
    def test_health_via_proxy(self):
        """Test 1: Health endpoint via frontend proxy"""
        try:
            response = requests.get(f"{self.frontend_proxy_url}/api/health", timeout=10)
            
            # Check status code
            if response.status_code != 200:
                self.log_result("Health via proxy - Status Code", False, f"Expected 200, got {response.status_code}")
                return False
                
            # Check JSON response
            try:
                data = response.json()
                required_keys = ["status", "service", "mongo_url_configured"]
                missing_keys = [key for key in required_keys if key not in data]
                
                if missing_keys:
                    self.log_result("Health via proxy - JSON Keys", False, f"Missing keys: {missing_keys}")
                    return False
                    
                # Check CORS headers
                cors_header = response.headers.get("Access-Control-Allow-Origin")
                if not cors_header or cors_header != "*":
                    # Double check with explicit Origin header
                    test_response = requests.get(f"{self.frontend_proxy_url}/api/health", 
                                               headers={"Origin": "http://localhost:3000"}, timeout=10)
                    cors_header = test_response.headers.get("Access-Control-Allow-Origin")
                    if not cors_header or cors_header != "*":
                        self.log_result("Health via proxy - CORS Headers", False, f"Expected '*', got '{cors_header}'")
                        return False
                    
                self.log_result("Health via proxy", True, f"Response: {data}")
                return True
                
            except json.JSONDecodeError:
                self.log_result("Health via proxy - JSON Parse", False, "Invalid JSON response")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_result("Health via proxy - Connection", False, f"Request failed: {str(e)}")
            return False
            
    def test_health_direct_backend(self):
        """Test 2: Health endpoint direct to backend"""
        try:
            response = requests.get(f"{self.backend_direct_url}/api/health", timeout=10)
            
            # Check status code
            if response.status_code != 200:
                self.log_result("Health direct backend - Status Code", False, f"Expected 200, got {response.status_code}")
                return False
                
            # Check JSON response
            try:
                data = response.json()
                required_keys = ["status", "service", "mongo_url_configured"]
                missing_keys = [key for key in required_keys if key not in data]
                
                if missing_keys:
                    self.log_result("Health direct backend - JSON Keys", False, f"Missing keys: {missing_keys}")
                    return False
                    
                self.log_result("Health direct backend", True, f"Response: {data}")
                return True
                
            except json.JSONDecodeError:
                self.log_result("Health direct backend - JSON Parse", False, "Invalid JSON response")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_result("Health direct backend - Connection", False, f"Request failed: {str(e)}")
            return False
            
    def test_ingress_prefix_adherence(self):
        """Test 3: Ensure /health without /api prefix returns 404"""
        try:
            response = requests.get(f"{self.backend_direct_url}/health", timeout=10)
            
            if response.status_code == 404:
                self.log_result("Ingress prefix adherence", True, "Correctly returns 404 for /health without /api")
                return True
            else:
                self.log_result("Ingress prefix adherence", False, f"Expected 404, got {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_result("Ingress prefix adherence - Connection", False, f"Request failed: {str(e)}")
            return False
            
    def test_stability_repeated_requests(self):
        """Test 4: Stability under repeated requests"""
        proxy_failures = 0
        direct_failures = 0
        
        # Test 5 requests via proxy
        for i in range(5):
            try:
                response = requests.get(f"{self.frontend_proxy_url}/api/health", timeout=10)
                if response.status_code != 200:
                    proxy_failures += 1
            except requests.exceptions.RequestException:
                proxy_failures += 1
                
        # Test 5 requests direct to backend
        for i in range(5):
            try:
                response = requests.get(f"{self.backend_direct_url}/api/health", timeout=10)
                if response.status_code != 200:
                    direct_failures += 1
            except requests.exceptions.RequestException:
                direct_failures += 1
                
        if proxy_failures == 0 and direct_failures == 0:
            self.log_result("Stability test", True, "All 10 requests (5 proxy + 5 direct) succeeded")
            return True
        else:
            self.log_result("Stability test", False, f"Proxy failures: {proxy_failures}/5, Direct failures: {direct_failures}/5")
            return False
            
    def run_all_tests(self):
        """Run all backend tests"""
        print("=" * 60)
        print("BACKEND API TESTING SUITE - CrimeConnect")
        print("=" * 60)
        
        tests = [
            self.test_health_via_proxy,
            self.test_health_direct_backend,
            self.test_ingress_prefix_adherence,
            self.test_stability_repeated_requests
        ]
        
        passed_tests = 0
        total_tests = len(tests)
        
        for test in tests:
            if test():
                passed_tests += 1
            print("-" * 40)
            
        print("=" * 60)
        print(f"SUMMARY: {passed_tests}/{total_tests} tests passed")
        print("=" * 60)
        
        # Show failed tests
        failed_tests = [r for r in self.results if not r["passed"]]
        if failed_tests:
            print("\nFAILED TESTS:")
            for test in failed_tests:
                print(f"- {test['test']}: {test['details']}")
                
        return passed_tests == total_tests

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)