import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { AlertTriangle, Home, Shield, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0a1117] bg-digital-circuit flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* FBI Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secure-red/10 border border-secure-red/30 mb-4">
            <AlertTriangle className="h-8 w-8 text-secure-red" />
          </div>
          <h1 className="text-2xl font-bold tracking-wider mb-2 text-secure-red">
            ACCESS DENIED
          </h1>
          <p className="text-muted-foreground text-sm">Error Code: 404</p>
          <p className="text-xs text-secure-red/80 mt-1 font-mono">RESOURCE NOT FOUND</p>
        </div>

        <Card className="glass-card">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center text-secure-red">
              <Shield className="mr-2 h-5 w-5" />
              Classified Resource
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="p-4 bg-secure-red/10 border border-secure-red/30 rounded-lg">
              <p className="text-sm text-secure-red mb-2">SECURITY ALERT</p>
              <p className="text-xs text-muted-foreground">
                The requested resource could not be found or you do not have sufficient clearance to access this classified material.
              </p>
            </div>
            
            <div className="space-y-3">
              <Link to="/dashboard">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  <Home className="mr-2 h-4 w-4" />
                  Return to Dashboard
                </Button>
              </Link>
              
              <Link to="/cases">
                <Button variant="outline" className="w-full border-primary/30 hover:border-primary">
                  <Search className="mr-2 h-4 w-4" />
                  Search Case Files
                </Button>
              </Link>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <p>If you believe this is an error, contact IT Security Division</p>
              <p className="font-mono text-primary/60 mt-1">REF: SEC-404-{Date.now().toString().slice(-6)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Security notice */}
        <div className="mt-6 p-4 bg-secure-yellow/10 border border-secure-yellow/30 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="h-4 w-4 text-secure-yellow mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-xs">
              <p className="text-secure-yellow font-medium mb-1">SECURITY PROTOCOL</p>
              <p className="text-muted-foreground">
                All access attempts are logged and monitored by the FBI Security Division. 
                Unauthorized access attempts will be investigated.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;